import express from "express";
import { allowed, protectedRoutes } from "../users/auth.js";
import { addOrder, addorderToAdmin, changeStatusUser, completeOrderFromDdelivery, completeOrderFromUser, getOneOrderToAdmins, getOrderCompletedFromDelivry, getOrderNotCompletedFromDelivry, getOrderToUser, getOrderWaitingForApprovalToAdmins, getOrdersFormOneAdmin, removeOrderFromUser, updateorder } from "./order.service.js";
const routerOrder = express.Router();
routerOrder.route('/')
    .post(protectedRoutes, allowed('user'), addOrder)
    .get(protectedRoutes, allowed('user'), getOrderToUser)
    .patch(protectedRoutes, allowed('user'), completeOrderFromUser)
    .put(protectedRoutes, allowed('user'), removeOrderFromUser)
routerOrder.patch('/updateorder', protectedRoutes, allowed('user'), updateorder)
routerOrder
    .get('/getOrderWaitingForApprovalToAdmins', protectedRoutes, allowed('user'), getOrderWaitingForApprovalToAdmins)
    .patch('/addorderToAdmin', protectedRoutes, allowed('user'), addorderToAdmin)
    .get('/getOrdersFormOneAdmin', protectedRoutes, allowed('user'),getOrdersFormOneAdmin)
    .post('/getOneOrderToAdmins', protectedRoutes, allowed('user'), getOneOrderToAdmins)
    .patch('/statusUser', protectedRoutes, allowed('user'), changeStatusUser)
    .patch('/completeOrderFromDdelivery', protectedRoutes, allowed('user'), completeOrderFromDdelivery)

    .get('/getOrderNotCompletedFromDelivry', protectedRoutes, allowed('user'), getOrderNotCompletedFromDelivry)
    .get('/getOrderCompletedFromDelivry', protectedRoutes, allowed('user'), getOrderCompletedFromDelivry)

export { routerOrder }