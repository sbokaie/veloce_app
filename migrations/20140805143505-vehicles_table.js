module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('vehicles', {
    	id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
            autoIncrement: true
    	},
    	make: {
    		type: DataTypes.STRING,
    		validate: {
    			notEmpty: true
    		},
    	},
    	model: {
    		type: DataTypes.STRING,
    		validate: {
    			notEmpty: true
    		}
    	},
    	year: {
    		type: DataTypes.INTEGER,
    		validate: {
    			notEmpty: true,
    		}
    	},
    	description: {
    		type: DataTypes.TEXT
    	},
    	imageURL: {
    		type: DataTypes.STRING,
    		validate: {
    			notEmpty: true
 			}
 		},
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	userId: {
    		type: DataTypes.INTEGER,
    		foreignKey: true,
    	},
    }).complete(done); 
},
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
     migration.dropTable('vehicles');
  } //closing down function
 
}; 
