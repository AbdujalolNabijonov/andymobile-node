class Definer {
  //Member related Errors
  static auth_err1 = "att: There no is member with that member nick!";
  static auth_err2 = "att: Password is incorrect!";
  static auth_err3 = "att: Token wasn't created!";
  static auth_err4 = "att: Product creator's type should be company!";
  static auth_err5 = "att: Please, log in first!";
  static follow_err1 = "att: You can not follow yourself!";
  static follow_err2 = "att: You have already followed to this user!";
  //Product Related Errors
  static product_err1 = "att: There is no product with that id!";
  //Smth related errors
  static smth_err1 = "att: Something went wrong!";
  //Order Error
  static order_err1 = "att: There is no order with that id!";
  //Data errors
  static data_err1 = "att: There is no data with that id!";
}

class HttpRequest {
  static Ok = 200;
}
module.exports = { Definer, HttpRequest };
