/**
 * AppFile Class
 * @namespace
 */
var AppFile = (function (_AppFile) {

    _AppFile.get = function (fileId) {
        if(!fileId) return AppError.client(
            'file/missing-info',
            'No file \'id\' found in request.'
        );

        var contentFolderId = Config.get('contentFolder');
        if(!contentFolderId) return AppError.server(
            'file/not-support',
            'No support for file uploading!'
        );
        
        try {
            DriveApp.getFolderById(contentFolderId);
        } catch(error) {
            return AppError.server(
                'file/not-support',
                'No support for file uploading!'
            );
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

        } catch(error) {
            return AppError.client(
                'file/unknown',
                'Errors happen, please try again!'
            );
        }
    }

    /**
     * 
     * @param {Object} file - File data
     * @param {string} customFolderName - Custom sub folder
     */
    _AppFile.set = function (file, customFolderName, customName) {
        var _this = this;

        if(!file) return AppError.client(
            'file/missing-info',
            'No file \'file.content\' found in request.'
        );

        if(!(file instanceof Object) ||
            !file.name ||
            !file.mimeType ||
            !file.base64String
        ) return AppError.client(
            'file/invalid',
            'File data must contains name, mimeType and base64String.'
        );

        var contentFolderId = Config.get('contentFolder');
        if(!contentFolderId) return AppError.server(
            'file/no-folder',
            'No support for file uploading!'
        );

        var folder;
        try {
            folder = DriveApp.getFolderById(contentFolderId);
        } catch(error) {
            return AppError.server(
                'file/no-folder',
                'No support for file uploading!'
            );
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

        var fileName = file.name;
        if(customName) fileName = customName;
        if(fileName === 'MD5') {
            fileName = Jsrsasign.KJUR.crypto.Util.md5(file.name);
        }
        if(fileName === 'AUTO') {
            fileName = Utilities.getUuid();
        }
        
        try {
            var file = folder.createFile(
                Utilities.newBlob(Utilities.base64Decode(file.base64String), file.mimeType, fileName)
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
        } catch(error) {
            return AppError.server(
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