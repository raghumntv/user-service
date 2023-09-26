# User Service CI/CD Implementation

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) setup for the User Service, a Node.js application. This CI/CD pipeline is designed to ensure code quality, run unit and end-to-end tests, and automate deployments.

## Workflow Overview

The CI/CD workflow consists of the following key steps:

1. **Unit Tests (unit-test job):**
   - This job runs whenever there is a push or pull request to the `main` branch.
   - It checks out the code, sets up Node.js, installs dependencies, and runs unit tests.
   - If the unit tests fail, the pipeline will stop, and the pull request cannot be merged.

2. **Build and Deploy (build and deploy jobs):**
   - The build job runs after successful unit tests on a push to the `main` branch.
   - It checks out the code, sets up Node.js, and installs dependencies.
   - The deploy job, triggered after the build job, deploys the code to a production environment.

3. **End-to-End Tests (test job):**
   - This job runs after a successful deployment.
   - It checks out a separate test repository, installs dependencies, and runs end-to-end tests.

## CI/CD Execution

1. When code is pushed to the main branch or a pull request is raised against the main branch, the unit-test job is triggered.
2. If the unit tests pass, the build job runs to prepare the code.
3. After a successful build, the deploy job is triggered to deploy the code.
4. Finally, the test job runs end-to-end tests on the deployed code.

## How to Execute the Workflow

To execute the CI/CD workflow, follow these steps:

1. **Clone the Repository:**
   - Clone the User Service repository to your local machine using Git:
     ```bash
     git clone https://github.com/raghumntv/user-service.git
     ```
   - Change your working directory to the cloned repository:
     ```bash
     cd user-service
     ```

2. **Push Code to `main` Branch or Raise a Pull Request:**
   - Make changes to the code as needed.
   - Push your changes to the `main` branch:
     ```bash
     git add .
     git commit -m "Your commit message"
     git push origin main
     ```
   - Alternatively, create a new branch, make changes, and raise a pull request against the `main` branch.

3. **GitHub Actions Workflow:**
   - Once you push to the `main` branch or raise a pull request, GitHub Actions will automatically trigger the workflow.

4. **Monitor Workflow Execution:**
   - Visit the "Actions" tab on your GitHub repository to monitor the progress and status of the workflow.
   - If any of the jobs fail (e.g., unit tests or deployment), you'll receive feedback through GitHub Actions.

5. **Merge Pull Requests:**
   - If you raised a pull request, it can only be merged if the unit tests pass successfully.
   - The build and deployment steps will run automatically on the `main` branch after a successful merge.

6. **End-to-End Tests:**
   - After deployment to production, the end-to-end tests will run to verify the functionality of the deployed code.
