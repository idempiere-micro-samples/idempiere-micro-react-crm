/* eslint-disable */
// const BASE_URL = ''; // 'http://localhost:3001/api'
// const BASE_URL = "http://localhost:5354/";
import db from "./demo-db"

let ds = ds || Object.assign({}, db)

function getModel(action) {
  if (action.includes('?') && action.includes('/')) {
    return action.indexOf('?') > action.indexOf('/') ? action.substring(0, action.indexOf('/')) : action.substring(0, action.indexOf('?'))
  } else {
    return action.includes('?') ? action.substring(0, action.indexOf('?')) : action.substring(0, action.indexOf('/'))
  }
}

function getId(action, model) {
  action = action.substr(model.length + 1)
  return action.length > 0 && (action.includes('?') ? action.substring(0, action.indexOf('?')) : action)
}

function getExpand(action) {
  action = action.substr(action.indexOf('?'))
  return action.includes('_expand') ? (
    action.includes('&') ?
      action.substring('_expand='.length + 1, action.indexOf('&')) :
      action.substring('_expand='.length + 1)) : undefined
}

function getEmbed(action) {
  return action.includes('?') ? action.substring(action.indexOf('/'), action.indexOf('?')) : action.substring(action.indexOf('/'))
}

function getGraphQLQuery(query) {
  const token = localStorage.getItem("token") || null;
  
  return fetch("http://localhost:9080/idempiere-micro-liberty-standalone/graphql",
    {
      method: "POST",      
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        query: `query { ${query} }`
      })
    }
  )
  .then((response) => response.json())
  .then((response) => response.data);
}

function callApi(endpoint, authenticated, method, data) {
  // const token = localStorage.getItem("token") || null;
  const config = {};

  const getData = (action) => {

    return new Promise(function (resolve, reject) {
      const model = getModel(action)
      const idStr = getId(action, model)
      const id = isNaN(idStr) ? undefined : parseInt(idStr)
      let exp = getExpand(action, model)
      const expandModel = exp ? exp === "category" ? "categories" : exp + "s" : exp
      const embed = getEmbed(action)
      console.log(model)
      let result
      let expand, expandId
      console.log(expandModel)
      if (model in ds) {
        if (id) {
          result = ds[model][ds[model].findIndex(d => d.id === id)]

          if (expandModel) {
            expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
            expandId = result[expand + "Id"]
            result[expand] = ds[expandModel][ds[expandModel].findIndex(d => d.id === expandId)]
          }
        } else {
          result = ds[model].map(m => {
            if (expandModel) {
              expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
              expandId = m[expand + "Id"]
              m[expand] = ds[expandModel][ds[expandModel].findIndex(d => d.id === expandId)]
            }
            return m
          })
        }
      }
      setTimeout(resolve, 200, JSON.stringify(result))
    });
  }

  const postData = (action, data) => {
    return new Promise(function (resolve, reject) {
      const model = getModel(action)
      data.id = ds[model] + 1
      ds[model].push(data)
      setTimeout(resolve, 200, JSON.stringify(result))
    })
  }

  const putData = (action, data) => {
    return new Promise(function (resolve, reject) {
      const model = getModel(action)
      const idx = ds[model].findIndex(d => d.id === data.id)
      ds[model][idx] = Object.assign({}, data)
      setTimeout(resolve, 200, JSON.stringify(result))
    })
  }
  const deleteData = (action) => {
    return new Promise(function (resolve, reject) {
      const model = getModel(action)
      const id = getId()
      id && ds[model].splice(ds[model].findIndex(d => d.id === id))
      setTimeout(resolve, 200, JSON.stringify({ status: 200 }))
    })
  }

  // console.log(config.method);

  switch (config.method) {
    case (null || undefined):
      return getData(endpoint)
    case ("PUT"):
      return putData(endpoint, data)
    case ("POST"):
      return postData(endpoint, data)
    case ("DELETE"):
      return deleteData(endpoint)
    default:
      return null;

  }

}

export const CALL_API = Symbol("Call API");


export default store => next => action => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === "undefined") {
    // Reset type action
    if (action.type) return next({ type: action.type });
    return next(action);
  }

  const { types, authenticated, method, data, filters } = callAPI;
  let endpoint = callAPI.endpoint;
  let query = callAPI.query;

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }

  if (!types.every(type => typeof type === "string")) {
    throw new Error("Expected action types to be strings.");
  }

  const [requestType, successType, errorType] = types;

  if ( query ) {
     return getGraphQLQuery(query).then(
      response =>
        next({
          response,
          authenticated,
          filters: filters,
          type: successType
        })
      );
  } else {
    if (typeof endpoint === "function") {
      endpoint = endpoint(store.getState());
    }

    if (typeof endpoint !== "string") {
      throw new Error("Specify a string endpoint URL.");
    }

    // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
    return callApi(endpoint, authenticated, method, data).then(
      response =>
        next({
          response,
          authenticated,
          filters: filters,
          type: successType
        }),
      error =>
        next({
          error: error,
          type: errorType
        })
    );
}
};
