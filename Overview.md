### Key Components

1. **Main Application (`main.py`)**
   - Initializes the FastAPI application.
   - Configures middleware for GZip compression and CORS.
   - Includes API routers for different functionalities.
   - Defines a root endpoint to return basic application information.
   - Runs the application using Uvicorn.

2. **Configuration (src/core/config.py)**
   - Defines the Settings class using Pydantic for application configuration.
   - Loads configuration from environment variables specified in a .env file.

3. **Logging (src/core/logging.py)**
   - Sets up a custom logger for the application.
   - Configures logging to write to a file named pdfly.log.

4. **Database Clients (db)**
   - firestore.py: Initializes Firestore client using Firebase credentials.
   - supabase.py: Initializes Supabase client using Supabase credentials.
   - __init__.py: Combines Firestore and Supabase clients into a Database class.

5. **Models (models)**
   - Defines data models using Pydantic for different entities like Chat, Message, PDF, and User.
   - Includes methods for CRUD operations on these entities using Supabase.

6. **Services (services)**
   - Implements business logic for handling user, chat, and PDF-related operations.
   - user_service.py: Handles user creation and retrieval.
   - chat_service.py: Manages chat creation, listing, and message responses.
   - pdf_service.py: Manages PDF uploads, listing, and chunking.

7. **API Routers (apis)**
   - Defines API endpoints for different functionalities.
   - chat.py: Endpoints for chat-related operations.
   - pdf.py: Endpoints for PDF-related operations.
   - user.py: Endpoints for user-related operations.
   - __init__.py: Combines all routers into a single router for the application.

8. **Utilities (utils)**
   - Contains utility functions and classes for text chunking, language model interactions, response generation, summarization, and vector store management.
   - chunker.py: Handles text chunking.
   - llm.py: Initializes the language model.
   - response_generator.py: Generates responses based on PDF content.
   - summarizer.py: Summarizes PDF content.
   - vector_store.py: Manages the vector store using Pinecone and HuggingFace embeddings.

9. **Validations (validations)**
   - Defines request and response models for API endpoints.
   - chat.py: Request models for chat-related operations.
   - user.py: Request models for user-related operations.
   - __init__.py : Combines all validation models.

### Interactions and Flow

1. **Configuration Loading**
   - The application loads configuration settings from the .env file using the Settings class in config.py.

2. **Application Initialization**
   - The FastAPI application is initialized in main.py.
   - Middleware for GZip compression and CORS is added.
   - API routers are included to handle different functionalities.

3. **API Requests**
   - Users interact with the application through API endpoints defined in apis.
   - Each endpoint calls the corresponding service function from services.

4. **Service Logic**
   - Service functions in services handle the business logic.
   - They interact with the database clients in db to perform CRUD operations on the models defined in models.

5. **Utilities**
   - Utility functions in utils assist with text processing, language model interactions, and vector store management.

6. **Logging**
   - Application logs are written to pdfly.log using the custom logger defined in logging.py