/**
 * AppFile Class
 * @namespace
 */
var AppFile = (function (_AppFile) {

    _AppFile.get = function (fileId) {
        if(!fileId)
            return AppError.make(
                'file/missing-info',
                'No file \'id\' found in request.'
            );

        var contentFolderId = Config.get('contentFolder');
        if(!contentFolderId)
            return AppError.make(
                'file/no-folder',
                'No support for file uploading!'
            );
        
        try {
            DriveApp.getFolderById(contentFolderId);
        } catch(error) {
            throw new Error('No content folder found!');
        }

        try {
            var file = DriveApp.getFileById(fileId);
            var id = file.getId();
            return {
                id: id,
                url: 'https://drive.google.com/uc?id='+ id +'&export=download',
                name: file.getName(),
                mimeType: file.getMimeType(),
                description: file.getDescription(),
                size: file.getSize(),
                link: file.getUrl()
            };

            // var file = Drive.Files.get(fileId);
            // return {
            //     id: file.id,
            //     url: file.webContentLink,
            //     name: file.title,
            //     mimeType: file.mimeType,
            //     description: file.description,
            //     size: file.fileSize,
            //     link: file.webViewLink,
            //     thumbnail: file.thumbnailLink
            // }
        } catch(error) {
            return {
                id: fileId
            }
        }
    }

    /**
     * 
     * @param {Object} file - File data
     * @param {string} customFolderName - Custom sub folder
     */
    _AppFile.set = function (file, customFolderName) {
        var _this = this;

        if(!file)
            return AppError.make(
                'file/missing-info',
                'No file \'file.content\' found in request.'
            );

        if(
            !(file instanceof Object) ||
            !file.name ||
            !file.mimeType ||
            !file.base64String
        )
            return AppError.make(
                'file/invalid',
                'File data must contains name, mimeType and base64String.'
            );

        var contentFolderId = Config.get('contentFolder');
        if(!contentFolderId)
            return AppError.make(
                'file/no-folder',
                'No support for file uploading!'
            );

        var folder;
        try {
            folder = DriveApp.getFolderById(contentFolderId);
        } catch(error) {
            throw new Error('No content folder found!');
        }
        
        // get uploads folder
        folder = _this.getFolderByName_(folder, 'uploads');

        // custom folder
        if(customFolderName) {
            folder = _this.getFolderByName_(folder, customFolderName);
        } else {
            var date = new Date();
            var year = ''+ date.getFullYear();
            var month = date.getMonth()+1;
                month = ''+ month < 10 ? '0'+ month: month;

            folder = _this.getFolderByName_(folder, year);
            folder = _this.getFolderByName_(folder, month);
        }
        
        try {
            var file = folder.createFile(
                Utilities.newBlob(Utilities.base64Decode(file.base64String), file.mimeType, file.name)
            ).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
            var id = file.getId();
            return {
                id: id,
                url: 'https://drive.google.com/uc?id='+ id +'&export=download',
                name: file.getName(),
                mimeType: file.getMimeType(),
                description: file.getDescription(),
                size: file.getSize(),
                link: file.getUrl()
            };
            
            // file = Drive.Files.get(file.getId());
            // return {
            //     id: file.id,
            //     url: file.webContentLink,
            //     name: file.title,
            //     mimeType: file.mimeType,
            //     description: file.description,
            //     size: file.fileSize,
            //     link: file.webViewLink,
            //     thumbnail: file.thumbnailLink
            // }
        } catch(error) {
            // throw new Error(error);
            return AppError.make(
                'file/not-saved',
                'Errors, file not saved, please try again later.'
            );
        }
        
    }

    _AppFile.getFolderByName_ = function (parentFolder, folderName) {
        var folder = parentFolder;
        var childFolders = folder.getFoldersByName(folderName);
        if(!childFolders.hasNext()) {
            folder = folder.createFolder(folderName);
        } else {
            folder = childFolders.next();
        }
        return folder;
    }

    return _AppFile;

})(AppFile||{});