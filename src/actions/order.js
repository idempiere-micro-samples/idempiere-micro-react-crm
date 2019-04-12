import { CALL_API } from "../middleware/api";
import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDERS_FAILURE,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  ADD_ORDER_REQUEST,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  NEW_ORDER_REQUEST
} from "../constants";

// Order actions

export function loadOrders(filters) {
  return {
    [CALL_API]: {
      query: "salesOrders { id DocumentNo Description DateOrderedISOFormat GrandTotal Customer { id name } }",
      orders: [],
      filters: filters,
      types: [LOAD_ORDERS_REQUEST, LOAD_ORDERS_SUCCESS, LOAD_ORDERS_FAILURE]
    }
  };
}

export function getOrder(id) {
  return {
    [CALL_API]: {
      query: `salesOrder(id: ${id}) { DocumentNo Description DateOrderedISOFormat GrandTotal Customer { id name } Lines { Product { id name } QtyOrdered UOM {Name UOMSymbol}} BusinessPartnerLocation { location { address1 address2 address3 address4 address5 city countryName } } }`,
      order: {},
      types: [GET_ORDER_REQUEST, GET_ORDER_SUCCESS, GET_ORDER_FAILURE]
    }
  };
}

export function updateOrder(order) {
  return {
    [CALL_API]: {
      endpoint: `orders/${order.id}`,
      data: order,
      method: "PUT",
      authenticated: true,
      updateSuccess: false,
      types: [UPDATE_ORDER_REQUEST, UPDATE_ORDER_SUCCESS, UPDATE_ORDER_FAILURE]
    }
  };
}

export function addOrder(order) {
  return {
    [CALL_API]: {
      endpoint: `orders/`,
      data: order,
      method: "POST",
      authenticated: true,
      addSuccess: false,
      types: [ADD_ORDER_REQUEST, ADD_ORDER_SUCCESS, ADD_ORDER_FAILURE]
    }
  };
}

export function newOrder() {
  return {
    type: NEW_ORDER_REQUEST
  };
}

export function deleteOrder(id) {
  return {
    [CALL_API]: {
      endpoint: `orders/${id}`,
      method: "DELETE",
      authenticated: true,
      types: [DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELETE_ORDER_FAILURE]
    }
  };
}
