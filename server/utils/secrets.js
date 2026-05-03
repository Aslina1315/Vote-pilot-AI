/**
 * Google Cloud Secret Manager Utility
 * Proactively fetches secrets from GCP Secret Manager in production.
 * Falls back to process.env for local development.
 */

let SecretManagerServiceClient;
try {
  SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient;
} catch (e) {
  // Package not installed, fallback logic will handle it
  SecretManagerServiceClient = null;
}

const client = SecretManagerServiceClient ? new SecretManagerServiceClient() : null;

/**
 * Loads a secret from GCP or fallback to process.env
 */
const getSecret = async (name, fallback = null) => {
  if (client && process.env.NODE_ENV === 'production' && process.env.GOOGLE_CLOUD_PROJECT) {
    try {
      const [version] = await client.accessSecretVersion({
        name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${name}/versions/latest`,
      });
      return version.payload.data.toString();
    } catch (err) {
      // Silent fallback to env
    }
  }
  
  return process.env[name] || fallback;
};

module.exports = { getSecret };

