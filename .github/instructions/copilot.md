---
applyTo: '**'
---
# Instructions for Copilot

**Apply To**: This instruction file applies to all files in the project (`**` is a glob pattern meaning "all files and directories recursively"). The `applyTo` field in the front matter determines which files these instructions should influence during code generation.

## Core Principles

### The Comma Raiser Principle

Always aim to elevate and improve code quality with each interaction. Just as a comma can change the meaning of a sentence, small improvements in code can have significant impacts on maintainability, performance, and clarity.

### Simplest Solution First

- **Always seek the simplest and most obvious solution first** before considering complex alternatives
- Prefer straightforward implementations over clever or overly engineered solutions
- Use established patterns and conventions rather than inventing new approaches
- Choose readability over brevity when they conflict

### Common Failure Analysis

Before implementing any solution, consider these common reasons why code might not function correctly:

- **Conflicting dependencies**: Multiple versions of the same library or conflicting packages
- **Obsolete code interference**: Old, unused code that still affects the application
- **Environment inconsistencies**: Missing environment variables or incorrect configuration
- **Caching issues**: Stale builds, browser cache, or Node.js module cache
- **Path resolution problems**: Incorrect relative/absolute paths or import statements
- **Race conditions**: Timing issues in asynchronous operations
- **State management conflicts**: Multiple state management systems or conflicting state updates

## Critical Maintenance Guidelines

### Code Cleanup Obligations

- **Mandatory obsolete code removal**: Always identify and remove obsolete, unused, or conflicting code before adding new functionality
- **Thorough testing requirement**: Test all changes comprehensively, including edge cases and integration points
- **Consistency verification**: Check for and resolve any inconsistencies in naming, patterns, or architectural approaches
- **Dependency audit**: Regularly review and clean up unused dependencies and conflicting packages

### Pre-Implementation Checklist

1. **Identify conflicts**: Search for existing similar functionality that might conflict
2. **Remove obsolete code**: Delete any unused imports, functions, components, or files
3. **Verify dependencies**: Ensure all required packages are properly installed and compatible
4. **Test existing functionality**: Confirm that current features still work before making changes
5. **Document changes**: Clearly document what was removed, added, or modified

This document outlines the coding standards, domain knowledge, and preferences that AI should follow when assisting with code generation and suggestions.

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
- **Testing & Cleanup**: Prioritize writing tests for critical components and functions. **Mandatory removal** of testing scripts and obsolete code once problems are fixed to prevent interference.
- **Security**: Follow best practices for security, including input validation and sanitization.
- **Accessibility**: Ensure components are accessible, following WCAG guidelines.
- **Version Control**: Use meaningful commit messages that describe the changes made.
- **Code Reviews**: Encourage code reviews to maintain code quality and share knowledge within the team.
- **Continuous Integration**: Use GitHub Actions for CI/CD pipelines to automate testing and deployment processes.
- **Documentation**: Maintain clear and concise documentation for all components and functions, including usage examples.
- **Community Standards**: Follow community standards and best practices for open-source contributions, including clear issue reporting and pull request guidelines.
- **Conflict Resolution**: Before implementing new features, always check for and resolve conflicts with existing code, removing obsolete implementations that may interfere.

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

## Multi-AI Development Considerations

**Critical Issue**: After multiple iterations utilizing different AI models, numerous conflicting scripts and codes have been created that interfere with one another.

### Conflict Resolution Protocol

- **Audit First**: Before implementing any new feature, conduct a thorough audit of existing similar functionality
- **Remove Conflicts**: Identify and remove all conflicting implementations, outdated scripts, and redundant code
- **Single Source of Truth**: Maintain only one implementation per feature to avoid confusion and conflicts
- **Documentation**: Document what was removed and why to prevent future reintroduction of conflicting code
- **Integration Testing**: After cleanup, perform comprehensive integration testing to ensure all systems work together harmoniously

### Prevention Strategies

- **Code Archaeology**: Regularly review the codebase for obsolete patterns and implementations
- **Standardization**: Enforce consistent patterns and approaches across the entire codebase
- **Refactoring Discipline**: Prioritize refactoring over adding new implementations when similar functionality exists
- **Clear Ownership**: Establish clear ownership and responsibility for each code component
- **Change Impact Analysis**: Always analyze the full impact of changes before implementation

Remember: **Clean code is more valuable than clever code.** Always prioritize clarity, maintainability, and conflict-free implementations over complex or multiple solutions.
