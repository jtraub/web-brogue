define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/lobby-data-table-base",
    "models/lobby-data-table-state",
    "views/file-row-view",
    "models/file-row"
], function ($, _, Backbone, send, lobbyTableBase, LobbyTableState, FileRowView, FileRowModel) {

    var fileViewCollection = {};

    var SavedGamesView = Backbone.View.extend({
        el: "#saved-games",
        tableSelector: "#saved-games-table",
        $tableElement: null,
        tableState: new LobbyTableState(),
        
        events: {
            "click .file-link" : "loadSavedGame"
        },
        
        headingTemplate: _.template($('#saved-games-heading').html()),

        updateRowModelData: function (data) {
            this.tableState.set("isEmpty", true);
            this.clearRowModelData();
            
            var numberOfGames = data.length

            if (data.length > 0) {
                this.tableState.set("isEmpty", false);
                // were there no files found before but now there is?
                this.renderHeadingOnEmptyChange();
            }

            for (var i = 0; i < numberOfGames; i++) {
                var fileData = data[i];

                if (!fileViewCollection[fileData.fileName]) {
                    var fileModel = new FileRowModel(fileData);
                    var newFileView = fileViewCollection[fileData.fileName] = new FileRowView({
                        model: fileModel,
                        id: "game-row-" + i
                    });

                    this.$tableElement.append(newFileView.render().el);
                }

            // were there files before but now there is not?
            this.renderHeadingOnEmptyChange();
            }
        },
        
        clearRowModelData : function(){
            fileViewCollection = {};
            
            if (this.$tableElement){          
                this.$tableElement.html("");
            }

        },
        
        loadSavedGame : function(event){
            event.preventDefault();
   
            var fileName = event.target.innerHTML;
            send("brogue", "start", {
                savedGame : fileName
            });
            
            this.goToConsole();
        }
    });

    _.extend(SavedGamesView.prototype, lobbyTableBase);

    return SavedGamesView;

});
