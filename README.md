# PDFly

PDFly lets you talk to your PDFs with ease. 🚀

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Backend](#backend)
  - [Environment Variables](#environment-variables)
  - [Running the Backend](#running-the-backend)
- [Frontend](#frontend)
  - [Environment Variables](#environment-variables-1)
  - [Running the Frontend](#running-the-frontend)
- [Deployment](#deployment)
- [Learn More](#learn-more)
- [Contributing](#contributing)
- [License](#license)

## Introduction

PDFly is a powerful tool that allows you to interact with your PDF documents through a chat interface. You can ask questions, get summaries, and more, all through a simple and intuitive interface.

## Features

- Chat with your PDFs
- Upload and manage PDF documents
- Get summaries and insights from your PDFs

P.S.: Oh, and about that API endpoint for uploading PDFs—yeah, it’s not going to work. Why? Because the embedding model needs infrastructure fancier than what free hosting services offer, and guess what? They all said nope. I could have hosted it on my Azure VM, but let’s be honest, I’m not about to burn my precious credits on a pre-interview assignment.

But hey, if you’re feeling adventurous (or just really determined), you can run it locally. Everything you need to get started is written in this README. Knock yourself out!

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [Supabase Account](https://www.supabase.com/) (for database)
- [Pinecone Account](https://pinecone.io) (for vector db)
- [Langsmith Account](smith.langchain.com) (for LLM monitoring)
- [Firestore Account](https://firebase.google.com/docs/firestore) (No longer needed)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/pdfly.git
    cd pdfly
    ```

2. Install dependencies for both backend and frontend:

    ```sh
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt

    cd ../frontend
    npm install
    ```

### Running the Development Server

#### Backend

1. Set up environment variables:

    Create a `.env` file in the backend directory with the discussed in section [Environment Variables](#environment-variables-1)

2. Run the backend server:

    ```sh
    cd backend
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    python main.py
    ```

#### Frontend

1. Set up environment variables:

    Create a `.env.local` file in the frontend directory with the content discussed in section [Environment Variables](#environment-variables-1)


2. Run the frontend server:

    ```sh
    cd frontend
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

### Environment Variables

The backend requires the following environment variables:

```env
APP_NAME="PDFly"
APP_VERSION="1.0.0"
ENVIRONMENT="development"

FIREBASE_PRIVATE_KEY_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_ID=""
FIREBASE_CLIENT_X509_CERT_URL=""

SUPABASE_URL="https://something.supabase.co"
SUPABASE_KEY=""

PINECONE_API_KEY=""

LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY=""
LANGCHAIN_PROJECT="PDFly"

TOGATHERAI_API_KEY=""

MAX_PDF_SIZE_MB=20
MAX_CHUNK_SIZE=500
CHUNK_OVERLAP=100

HOST="127.0.0.1"
PORT=8000
CORS_ALLOWED_ORIGINS="http://localhost:3000"
```

### Running the Backend

To run the backend server, use the following command:

```sh
cd backend
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
python main.py
```

## Frontend

### Environment Variables

The frontend requires the following environment variables:

```env
DATABASE_URL="postgresql://postgres:pswd@host:5432/postgres"
NEXT_PUBLIC_AUTH_URL="https://auth-painsicle.thedevyash.workers.dev"
NEXT_PUBLIC_HOST="http://localhost:3000"
NEXT_PUBLIC_AUTH_CLIENT_ID=""
NEXT_PUBLIC_API_SERVER="http://localhost:8000"
```

### Running the Frontend

To run the frontend server, use the following command:

```sh
cd frontend
npm run dev
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - learn about FastAPI features and API.
- [LangChain Documentation](https://langchain.readthedocs.io/en/latest/) - learn about LangChain features and API.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.