Basic documentation for this change - One-To-Many page (advanced form page)

Form Page (Detail page):
This page is improved to support OneToMany association. This page shows Order and OrderItems.
Order is the parent. OrderItem is the child object.
Order has collection of OrderItem objects. We refer this as OneToMany association OR collection type. Refer ecomrubyV3 model, posted above.

Assumption: the number of item objects are limited.

A table is used for OrderItem objects in this page. This table comes with defined functionality like Add, Edit, View & Delete. These operations can be performed independently of the Order object.

While creating Order (before submission):
	When the OrderItem objects are added/modified, they are stored locally in the browser session.

When Order form is submitted:	
	All these item objects are saved into database nested into Order object. 

When Order form is cancelled, without saving/submitting:
	All the item objects added to table are lost. They are not saved into database.
	
Edit Order - when submitted:
	Newly added item objects are added to the order.
	Modified item objects are updated independently to OrderItems.
	
Delete Order:
	Associated item objects are also deleted from database.