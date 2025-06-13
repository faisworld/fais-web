---
applyTo: '**'
---
# Instructions for Copilot

This document outlines the coding standards, domain knowledge, and preferences that AI should follow when assisting with code generation and suggestions.
Coding standards, domain knowledge, and preferences that AI should follow.

## Coding Standards

- **Language**: Use TypeScript for all code examples.
- **Framework**: Use Next.js for web applications and up-to-date libraries and documentation.
- **State Management**: Use React Context API or Zustand for state management.
- **API Calls**: Use Axios or Fetch API for making HTTP requests.
- **File Structure**: Organize files by feature, with separate directories for components, pages, and utilities.
- **Components**: Use functional components with hooks for state and lifecycle management.
- **Styling**: Use Tailwind CSS for styling components.
- **Linting**: Follow ESLint rules for code quality.
- **Formatting**: Use Prettier for code formatting.
- **Testing**: Write unit tests using Jest and React Testing Library.
- **Command for bash formatting**: UsShould use this excample: cd /c/Users/solar/Projects/fais-web
- **Command for bash formatting**: Use this example: `cd /c/Users/solar/Projects/fais-web`
- **Git**: Use Git for version control, with clear commit messages.
- **Documentation**: Use JSDoc for documenting functions and components.

## Domain Knowledge

- **Web Development**: Familiarity with Next.js, React, and TypeScript.
- **AI and Machine Learning**: Understanding of AI concepts, particularly in image generation and natural language processing.
- **Cloud Services**: Knowledge of deploying applications on platforms like Vercel and AWS.
- **APIs**: Experience with RESTful and GraphQL APIs.
- **Databases**: Familiarity with both SQL (PostgreSQL) - I am using Neon database aqt the moment which you may connecgt directly with credentials from .env.local and Prisma Postgres.
- **Authentication**: Understanding of authentication mechanisms, including OAuth and JWT. Specifically here I am using admin panel access using localhost only and for automated blog plus image posting using internal API key with cron.

## Preferences

- **Code Style**: Prefer concise and readable code with clear variable names.
- **MarkdownLint violations**: Always refer to markdown lint rules when compiling .md or similar files.
- **Error Handling**: Implement robust error handling and logging.
- **Performance**: Optimize for performance, especially in image loading and rendering.
- **Testing**: Prioritize writing tests for critical components and functions But remember to remove those testing scripts if no longer needed and the problem fixed.
- **Security**: Follow best practices for security, including input validation and sanitization.
- **Accessibility**: Ensure components are accessible, following WCAG guidelines.
- **Version Control**: Use meaningful commit messages that describe the changes made.
- **Code Reviews**: Encourage code reviews to maintain code quality and share knowledge within the team.
- **Continuous Integration**: Use GitHub Actions for CI/CD pipelines to automate testing and deployment processes.
- **Documentation**: Maintain clear and concise documentation for all components and functions, including usage examples.
- **Community Standards**: Follow community standards and best practices for open-source contributions, including clear issue reporting and pull request guidelines.

## Additional Notes

- **AI Integration**: When integrating AI features, ensure that the implementation is efficient and does not compromise the application's performance besides always verify you are up-to-date with the latest AI models and libraries.
- **Image Handling**: Use optimized image formats (like WebP) and lazy loading techniques to improve performance.
- **SEO Best Practices**: Implement SEO best practices, including proper meta tags, structured data, and performance optimization for web applications.
- **Error Reporting**: Use a centralized error reporting tool (like Sentry) to track and resolve issues in production.
- **Code Comments**: Use comments sparingly and only when necessary to explain complex logic or decisions.
- **Code Reusability**: Encourage the creation of reusable components and functions to reduce code duplication and improve maintainability.
- **Feature Flags**: Implement feature flags for new features to allow gradual rollouts and testing in production environments.
- **Performance Monitoring**: Use tools like Lighthouse to monitor and improve application performance regularly.
- **User Experience**: Prioritize user experience by ensuring fast load times, responsive design, and intuitive navigation.
- **Feedback Loop**: Establish a feedback loop with users to gather insights and improve the application based on real-world usage.
- **Environment Variables**: Use environment variables for sensitive information and configuration settings, ensuring they are not hard-coded in the codebase.
- **Code Modularity**: Structure code into modules to enhance maintainability and scalability.
- **Dependency Management**: Keep dependencies up-to-date and remove unused packages to reduce security vulnerabilities and improve performance.
- **Error Messages**: Provide clear and user-friendly error messages to enhance the user experience during failures.
- **Code Consistency**: Maintain consistency in code style and structure across the project to improve readability and collaboration.
- **Code Refactoring**: Regularly refactor code to improve readability, performance, and maintainability.
- **Community Engagement**: Engage with the developer community through forums, social media, and open-source contributions to stay updated on best practices and trends.
- **Learning and Adaptation**: Stay open to learning new technologies and adapting to changes in the development landscape to continuously improve skills and knowledge.
- **Backup and Recovery**: Implement a backup and recovery strategy for critical data and configurations to prevent data loss in case of failures.
- **Localization and Internationalization**: Consider localization and internationalization from the start to support a global audience (English and Ukrainian languages).
- **Code Ownership**: Encourage ownership of code components, allowing developers to take responsibility for their work and contribute to the project's success.
- **Code Reviews**: Conduct regular code reviews to ensure code quality, share knowledge, and foster collaboration within the team.
- **Onboarding Documentation**: Maintain comprehensive onboarding documentation for new developers to quickly get up to speed with the project.
- **Project Management**: Use project management tools (like GitHub Projects or Trello) to track tasks, issues, and progress effectively.
- **Continuous Learning**: Encourage continuous learning and professional development through workshops, courses, and conferences.
- **Open Source Contributions**: Encourage contributions to open-source projects to foster collaboration and knowledge sharing within the developer community.  
- **Code Snippets**: Use code snippets for common patterns and practices to improve development speed and consistency.
- **Code Comments**: Use comments to explain complex logic or decisions, but avoid over-commenting; the code should be self-explanatory where possible.
- **Performance Optimization**: Regularly profile and optimize code for performance, especially in critical areas like rendering and data fetching.
