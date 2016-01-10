import Reflux from 'reflux' 

export const comments = Reflux.createActions({
	add: { asyncResult: true }
})
export const auth = Reflux.createActions({
	login: { asyncResult: true }
})