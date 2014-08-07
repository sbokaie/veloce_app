module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('users',{
    	id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true 
    	},
    	email: {
    		type: DataTypes.STRING,
    		unique: true,
    	},
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
    	password: {
    		type: DataTypes.STRING,
    		validate: {
    			notEmpty: true,
    		}
		},
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    }).complete(done); 
},
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('users');
  } //closing down function
 
}; // closing module.exports
