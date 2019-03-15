pipeline {

    parameters {
        booleanParam(name: 'PROMOTE_ARTIFACT', defaultValue: false, description: 'When checked, this will promote the artifact specified by the GIT_TAG below to docker-production where the artifact will be stored permanently.')
        gitParameter(defaultValue: 'master', name: 'GIT_TAG', type: 'PT_TAG', sortMode: 'DESCENDING_SMART', description: 'Optionally, select a Git tag specifying the artifact which should be promoted to docker-production. This value is not used in non-promote jobs.')
    }
    options {
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
    }
    agent {
        node {
            label "docker"
        }
    }
    environment {
        PATH = "/home/jenkins/.local/bin:$PATH"
        REQUESTS_CA_BUNDLE = "/etc/ssl/certs"
        JAVA_HOME = "/usr/lib/jvm/jdk-10.0.2"
        VENV_BIN = "/local1/virtualenvs/jenkinstools/bin"
        PYTHON = "${VENV_BIN}/python3"
    }
    stages {
        stage ("initialize build") {
            steps {
//                this.notifyBB("INPROGRESS")
                echo "BUILDTYPE: " + ( params.PROMOTE_ARTIFACT ? "Promote Image" : "Build, Publish and Tag")
                echo "${BRANCH_NAME}"
                git url: "${env.GIT_URL}", branch: "${env.BRANCH_NAME}", credentialsId:"9b2bb39a-1b3e-40cd-b1fd-fee01ebef965"
            }
        }
        stage ("test") {
            when {
                not { expression { return params.PROMOTE_ARTIFACT }}
            }
            steps {
                sh "./gradlew -i test"
            }
        }
        stage ("build and push branch") {
            when {
                not { expression { return params.PROMOTE_ARTIFACT }}
            }
            steps {
                echo "This is not a master build or a promote build"
                sh "${PYTHON} ${VENV_BIN}/manage_version -t maven -s prepare"
                sh './gradlew -i npmInstall snapshotPublish'
            }
        }
        stage ("promote") {
            when {
                expression { return params.PROMOTE_ARTIFACT }
            }
            steps {
                echo "Promoting artifacts"
                sh "${PYTHON} ${VENV_BIN}/promote_artifact -t maven -g ${params.GIT_TAG}"
            }
        }
    }
    post {
        always {
//            this.notifyBB(currentBuild.result)
        }
        cleanup {
            sh './gradlew -i  artifactClean'
        }
    }
}

def notifyBB(String state) {
    // on success, result is null
    state = state ?: "SUCCESS"

    if (state == "SUCCESS" || state == "FAILURE") {
        currentBuild.result = state
    }

    notifyBitbucket commitSha1: "${GIT_COMMIT}",
            credentialsId: 'aea50792-dda8-40e4-a683-79e8c83e72a6',
            disableInprogressNotification: false,
            considerUnstableAsSuccess: true,
            ignoreUnverifiedSSLPeer: false,
            includeBuildNumberInKey: false,
            prependParentProjectKey: false,
            projectKey: 'SW',
            stashServerBaseUrl: 'https://aicsbitbucket.corp.alleninstitute.org'
}
