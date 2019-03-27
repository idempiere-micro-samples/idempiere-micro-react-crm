# React Redux CRM on iDempiere Micro

> A reusable CRM project for real-world business based on React 15.4, React-Redux, Material-UI and iDempiere Micro

This application is a fork of [harryho/react-crm](https://github.com/harryho/react-crm).

### Features

- This project is built on the top of React/Redux.
- The UI part of this project uses Material-UI.
- This project uses Redux-Thunk to support back-end API.
- The GraphQL API backend is provided by [iDempiere Micro Java 8 EE](https://github.com/iDempiere-micro/idempiere-micro-liberty-standalone)

* Fake API is just readonly fake service.
* CRUD functions for Customer, Order and Product

## Build Setup

```bash
# Clone project
git clone https://github.com/harryho/react-crm.git


# install the packages with yarn
cd react-crm
yarn install

# start the server with hot reload at localhost:4000
npm run start
# or yarn
yarn start


## You might see sth below.
#
# [Browsersync] Access URLs:
#  ------------------------------------
#        Local: http://localhost:4000
#     External: http://192.168.1.5:4000
#  ------------------------------------
#           UI: http://localhost:4001
#  UI External: http://localhost:4001
#  ------------------------------------
# [Browsersync] Serving files from: src
# [Browsersync] Watching files...
# webpack: wait until bundle finished: /index.html
# webpack built de2fee97ada8c77dde8e in 10556ms
# Child html-webpack-plugin for "index.html":


## development
npm run demo
# or yarn
yarn demo

## build for dev
npm run build

## build for production
npm run build --mode production
```

## Welcome to fork or clone!

For detailed explanation on how things work, checkout following links please.

- [React](https://facebook.github.io/react/)
- [Redux](http://redux.js.org/)
- [Material-UI](http://www.material-ui.com/)
- [iDempiere Micro](https://idempiere-micro.github.io/)
