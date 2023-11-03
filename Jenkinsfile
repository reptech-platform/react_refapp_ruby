pipeline {
    agent {
        label 'vetpet'
    }
    stages {
        stage('build') {
            steps {
                sh "npm install"
                sh "npm run build" 
            }
        }
        stage ('copy to s3 bucket') {
            steps {
                sh "aws s3 sync build/ s3://react-refapp-ruby"
            }
        }
    }
}

