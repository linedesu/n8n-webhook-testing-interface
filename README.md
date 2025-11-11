# n8n Webhook Testing Interface

A simple, powerful testing tool designed to help you debug and test n8n webhook endpoints. This interface allows you to simulate various HTTP requests and provides a clear, detailed view of both the request inputs and the corresponding response outputs.

The application features a sleek, hacker-themed UI built with Tailwind CSS for a modern and developer-friendly experience.

## Features

-   **Multiple HTTP Methods**: Supports `POST`, `GET`, `PUT`, and `DELETE` requests.
-   **Full Request Customization**: Easily configure the webhook URL, query parameters, and HTTP headers.
-   **Flexible Body Editor**:
    -   Compose raw JSON bodies for `POST` and `PUT` requests.
    -   Includes real-time JSON validation to prevent syntax errors.
    -   Comes with pre-built payload templates for common use cases (e.g., simple JSON, customer data, GitHub webhooks).
-   **File Uploads**: Supports `multipart/form-data` uploads, allowing you to test workflows that handle files.
-   **Detailed Response Panel**:
    -   Displays the HTTP status code with color-coding for success/failure.
    -   Shows the request response time in milliseconds.
    -   Provides a view of all response headers.
    -   Renders the response body with JSON formatting and a "copy to clipboard" feature.
-   **Request History**:
    -   Automatically saves the last 20 requests to `localStorage`.
    -   Load any past request with a single click to re-run or modify it.
    -   Option to clear the entire history.
-   **Responsive Design**: A clean, two-panel layout that works seamlessly on different screen sizes.

## How It Works

The application is a single-page React application that uses the browser's `fetch` API to send HTTP requests to the specified n8n webhook URL.

### Usage Guide

1.  **Enter URL**: Paste your n8n webhook URL into the main input field.
2.  **Select Method**: Choose the appropriate HTTP method from the dropdown (`POST`, `GET`, etc.).
3.  **Configure Request**:
    -   **Query Params**: Use the "Query Params" tab to add key-value pairs that will be appended to the URL.
    -   **Headers**: Use the "Headers" tab to add custom request headers. `Content-Type: application/json` is added by default.
    -   **Body**: For `POST`/`PUT` requests, use the "Body" tab to write your JSON payload. You can use the templates dropdown for a quick start.
    -   **Files**: To send files, use the "Files" tab. Assign a key to each file and select the file from your local machine. Note that using this feature will automatically send the request as `multipart/form-data`, and the content in the "Body" tab will be ignored.
4.  **Send Request**: Click the "Send" button. A loading indicator will appear while the request is in flight.
5.  **Analyze Response**: The response from your webhook will be displayed in the right-hand panel, showing the status, time, headers, and body.
6.  **Use History**: Click the "History" button in the header to view, load, or clear previous requests.

## Project Structure

The project is organized into several key files:

-   `index.html`: The main entry point of the web application. It sets up the HTML document structure, imports Google Fonts, and configures Tailwind CSS. It also includes the import map for React dependencies and mounts the main script.
-   `index.tsx`: The TypeScript entry point for the React application. It finds the root DOM element and renders the main `App` component into it.
-   `App.tsx`: This is the core component of the application. It manages all the state, including the request data, response data, loading state, and history. It orchestrates all the child components (`RequestPanel`, `ResponsePanel`, `HistoryPanel`) and contains the main logic for sending requests.
-   `types.ts`: Defines all the TypeScript types and interfaces used throughout the project, ensuring type safety and code clarity (e.g., `RequestData`, `ResponseData`, `HistoryItem`).
-   `constants.ts`: A centralized file for storing application-wide constants, such as the list of supported HTTP methods and the sample JSON payload templates.
-   `metadata.json`: Provides metadata about the application for the development environment.
-   `README.md`: (This file) Provides documentation and an overview of the project.

## Technologies Used

-   **React**: For building the user interface as a component-based single-page application.
-   **TypeScript**: For adding static typing to JavaScript, improving code quality and maintainability.
-   **Tailwind CSS**: For a utility-first CSS framework that enables rapid UI development.
-   **Browser Fetch API**: For making HTTP requests to the webhook endpoints.
-   **Browser localStorage**: For persisting the request history on the client-side.
