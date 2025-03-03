import express from 'express'
import APICon from '../controllers/api/API'

const Router = express.Router({
    caseSensitive: true,
    strict: true
})
Router.get('/API/:hash', APICon)
export default Router