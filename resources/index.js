
exports.handler = {
  GET : function(req, res){
    res.object({})
      .link("browser", req.uri.child("browser"))
      .link("user", req.uri.child("user"))
      .link("session", req.uri.child("session"))
      .send();
  }

};
