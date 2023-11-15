# NeonAI
This is one of my sandbox repositories where I am developing and researching to create a smart AI network.

## Goals
The goal is to create a network out of AI components that work with each other to process more complex requests. The goal is to create an architecture that is dynamic and modular so new functionalities can be added using a plugin like approach.

## Work in Progress
This entire Project is highly work in progress. Currently I can only send prompts and call basic APIs. None of the networking stuff is done and none of the plugin stuff is done. The Interface is also currently a Terminal.

Everything that is written inside this README is also subject to change and propably will change in the future. In the future everthing will be installable using Docker Containers and I will create a aesthetic user interface for client and server sided applications.

## Architecture
1. **Core**: The the *connection* between the other components. Everything that is getting processed was at least one time on the core. The core is basically an abstract way of calling the sub components.
2. **AI Server**: The AI Server is the component that runs the LLaMA AIs. The AI Server provides an API (that is used by the core and other components) to generate text on demand. The AI Server should run on the fastest machine inside the network.
3. **Relay**: Relays are the functionality behind the AI Network. Relays provide an API via HTTP, RPC or Sockets. Relays can also be run on devices like a phone to control some aspects of the phone using the AI Network.
4. **Application**: This is the application that runs on the user devices. This application communicates using its relay and the core component.

## Example
In the 1st example, a user enters the following prompt: `What is the current time in Cebu City?`

1. The request is being sent to the Core via Sockets
2. The Core sends a request to the *AI Server* to process the user's prompt
3. The AI Server sees it has to call an internal function `get_time` with the parameter `timezone=Asia/Manila`
4. This request gets sent to the Relay Server that provided the endpoint
5. The relay server processes the request (in this time sends an API call to a time API) and responds with a text response like `{ "type": "message", "content": "The current time in 'Asia/Manila' is 21:34." }`
6. The AI Server sees the request is completed as it got a response with type `message`
7. The message is getting sent back to the core which then sends it to the user's device

---

In the 2nd example, a user prompts for example: `Hello, who are you?`

1. The request is being sent to the Core via Sockets
2. The Core sends a request to the *AI Server* to proces the user's prompt
3. The AI Server will find no function to call, so it sends it to itself again but with a model that is fine-tuned on chat messages
4. The response is getting sent to the core which then sends the response back to the user's device

## Run it yourself
Currently the project is not meant to run on your own computer.  
If you really want to do it, you have to clone the repo, download a Llama-V2 model for function calling and a model for chat messages.  
Put the models into a folder that can be found by the project and edit the ENV-variable inside the .env file. (I am currently using WizardLM and Llama-2 Function Calling)
After that you need to write a system prompt per model to improve the output quality and link the file usinge the right ENV-variable.

## FAQ
### Q: Why the Name?
---  
So I don't always have to answer because of the VALORANT Agent Neon, here is a acronym (and acronyms are cool):  
**N**etworked  
**e**nhanced  
**o**perational  
**n**erual  
**A**rtifical  
**I**nteligence  
