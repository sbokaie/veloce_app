module.exports = function (sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
        create a  model like `post`
        with attributes like `body` and `title`
    */
    var Vehicle = sequelize.define('vehicle',{
        make: DataTypes.STRING,
        model: DataTypes.STRING,
        year: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        imageURL: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        }
    },
    {
      classMethods: {
        associate: function(db){
          Vehicle.belongsTo(db.user);
        }
      }
    });
    return Vehicle;
};
