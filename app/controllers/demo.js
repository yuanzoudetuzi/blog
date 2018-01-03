exports.all = function (req,res) {
    res.render("demo_list",{
        title:"鲤.池"
    })
};

exports.detail = function (req,res) {
   let id = req.query.id;
   res.render("demo"+id);
};