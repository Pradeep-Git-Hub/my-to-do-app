const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || 'TodoDb';
const containerId = process.env.COSMOS_CONTAINER || 'Tasks';

let client;
let container;

function ensureClient() {
  if (!client) {
    if (!endpoint || !key) throw new Error('COSMOS_ENDPOINT and COSMOS_KEY must be set');
    client = new CosmosClient({ endpoint, key });
    container = client.database(databaseId).container(containerId);
  }
}

module.exports = async function (context, req) {
  context.log('CreateTask function processed a request.');
  try {
    ensureClient();
    const body = req.body || {};
    const title = (body.title || '').trim();
    if (!title) {
      context.res = { status: 400, body: { error: 'title is required' } };
      return;
    }
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const item = {
      id,
      title,
      completed: !!body.completed,
      createdAt: new Date().toISOString()
    };
    const { resource } = await container.items.create(item);
    context.res = { status: 201, body: resource };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
