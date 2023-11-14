import weaviate
import langchain
import gradio as gr
from langchain.embeddings import CohereEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain.prompts.prompt import PromptTemplate
from langchain.document_loaders import UnstructuredFileLoader
from langchain.vectorstores import Weaviate
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
import os
import urllib.request
import ssl
import mimetypes
from dotenv import load_dotenv
import cohere

# Load environment variables
load_dotenv()
openai_api_key = os.getenv('OPENAI')
cohere_api_key = os.getenv('COHERE')
weaviate_api_key = os.getenv('WEAVIATE')
weaviate_url = os.getenv('WEAVIATE_URL')

# Define your prompt templates
prompt_template = """
your preferred texts.

{context}

{chat_history}
Human: {human_input}
Chatbot:
"""

summary_prompt_template = """
Current summary:
{summary}

new lines of conversation:
{new_lines}

New summary:
"""

# Initialize chat history
chat_history = ChatMessageHistory.construct()

# Create prompt templates
summary_prompt = PromptTemplate(input_variables=["summary", "new_lines"], template=summary_prompt_template)
load_qa_chain_prompt = PromptTemplate(input_variables=["chat_history", "human_input", "context"], template=prompt_template)

# Initialize memory
memory = ConversationSummaryBufferMemory(
    llm="your llm",
    memory_key="chat_history",
    input_key="human_input",
    max_token=5000,
    prompt=summary_prompt,
    moving_summary_buffer="summary",
    chat_memory=chat_history
)

# Load QA chain with memory
qa_chain = load_qa_chain(llm="your llm", chain_type="stuff", memory=memory, prompt=load_qa_chain_prompt)

# Weaviate connection
auth_config = weaviate.auth.AuthApiKey(api_key=weaviate_api_key)
client = weaviate.Client(url=weaviate_url, auth_client_secret=auth_config, 
                         additional_headers={"X-Cohere-Api-Key": cohere_api_key})

# Initialize vectorstore
vectorstore = Weaviate(client, index_name="HereChat", text_key="text")
vectorstore._query_attrs = ["text", "title", "url", "views", "lang", "_additional {distance}"]
vectorstore.embedding = CohereEmbeddings(model="embed-multilingual-v2.0", cohere_api_key=cohere_api_key)

# Initialize Cohere client
co = cohere.Client(api_key=cohere_api_key)

def embed_pdf(file, collection_name):
    # Save the uploaded file
    filename = file.name
    file_path = os.path.join('./', filename)
    with open(file_path, 'wb') as f:
        f.write(file.read())

    # Checking filetype for document parsing
    mime_type = mimetypes.guess_type(file_path)[0]
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load()

    # Generate embeddings and store documents in Weaviate
    embeddings = CohereEmbeddings(model="embed-multilingual-v2.0", cohere_api_key=cohere_api_key)
    for doc in docs:
        embedding = embeddings.embed([doc['text']])
        weaviate_document = {
            "text": doc['text'],
            "embedding": embedding
        }
        client.data_object.create(data_object=weaviate_document, class_name=collection_name)

    os.remove(file_path)
    return {"message": f"Documents embedded in Weaviate collection '{collection_name}'"}

def update_chat_history(user_message, ai_message):
    chat_history.add_user_message(user_message)
    chat_history.add_ai_message(ai_message)
    # Update memory if needed
    if len(chat_history) > memory.max_token:
        memory.create_summary()

def retrieve_info(query):
    update_chat_history(query, "")
    llm = OpenAI(temperature=0, openai_api_key=openai_api_key)
    qa = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())
    
    # Retrieve initial results
    initial_results = qa({"query": query})

    # Assuming initial_results are in the desired format, extract the top documents
    top_docs = initial_results[:25]  # Adjust this if your result format is different

    # Rerank the top results
    reranked_results = co.rerank(query=query, documents=top_docs, top_n=3, model='rerank-english-v2.0')

    # Format the reranked results
    formatted_results = []
    for idx, r in enumerate(reranked_results):
        formatted_result = {
            "Document Rank": idx + 1,
            "Document Index": r.index,
            "Document": r.document['text'],
            "Relevance Score": f"{r.relevance_score:.2f}"
        }
        formatted_results.append(formatted_result)
        
    return {"results": formatted_results}
        # Format the reranked results and append to user prompt
    user_prompt = f"User: {query}\n"
    for idx, r in enumerate(reranked_results):
        user_prompt += f"Document {idx + 1}: {r.document['text']}\nRelevance Score: {r.relevance_score:.2f}\n\n"

    # Final API call to OpenAI
    final_response = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {
                "role": "system",
                "content": "You are a redditor. Assess, rephrase, and explain the following. Provide long answers. Use the same words and language you receive."
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=1.63,
        max_tokens=2240,
        top_p=1,
        frequency_penalty=1.73,
        presence_penalty=1.76
    )

    return final_response.choices[0].text

def combined_interface(query, file, collection_name):
    if query:
        return retrieve_info(query)
    elif file is not None and collection_name:
        return embed_pdf(file, collection_name)
    else:
        return "Please enter a query or upload a PDF file."

iface = gr.Interface(
    fn=combined_interface,
    inputs=[
        gr.Textbox(label="Query"),
        gr.File(label="PDF File"),
        gr.Textbox(label="Collection Name")
    ],
    outputs="text"
)

iface.launch()