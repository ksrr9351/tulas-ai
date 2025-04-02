# ChatGPT-Like Chatbot

This is a ChatGPT-like chatbot built using Next.js, MongoDB, and the OpenAI API. The chatbot enables users to interact with AI-generated responses while securely storing chat history.

## Features
- AI-powered chatbot using OpenAI's API
- Next.js for a seamless and efficient frontend and backend
- MongoDB for data storage
- JWT authentication for user security
- Encryption for sensitive data

## Technologies Used
- **Next.js** (React framework)
- **MongoDB** (Database for storing chat history and user data)
- **OpenAI API** (For AI responses)
- **JWT Authentication** (For user sessions and security)
- **Encryption** (For securing sensitive data)

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (>=16.x)
- MongoDB

### Clone the Repository
```sh
git clone https://github.com/your-username/chatbot.git
cd chatbot
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory and add the following:
```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_uri
ENCRYPTION_SECRET=your_encryption_secret
JWT_SECRET=your_jwt_secret
```
Replace the placeholders with your actual credentials.

### Run the Application
```sh
npm run dev
```
This will start the Next.js development server at `http://localhost:3000`.

## Deployment
To deploy the chatbot, use a platform that supports Next.js, such as:
- **Vercel** (Recommended)
- **Netlify**
- **AWS / DigitalOcean**

Ensure that you set the environment variables in the hosting platform.

## License
This project is open-source under the [MIT License](LICENSE). Feel free to modify and use it according to your needs.

## Contributions
Contributions are welcome! Feel free to submit issues and pull requests.

## Contact
For any queries, contact me at [your-email@example.com].

