pipeline {
    agent any

    environment {
        IMAGE_NAME = "e-aspirants"
        CONTAINER_NAME = "e-aspirants-container"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Prathik2004/e-aspirants.git'
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME ./server .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d \
                  -p 3000:3000 \
                  --name $CONTAINER_NAME \
                  $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successfulll"
        }
        failure {
            echo "❌ Deployment Failed"
        }
    }
}
