// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Delinked {
    string public name = "Delinked";

    //store image
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address author
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address author
    );

    Image[] allAllimages;

    // Create Images
    function uploadImage(
        string memory _imgHash,
        string memory _description
    ) public {
        require(bytes(_description).length > 0);
        require(bytes(_imgHash).length > 0);
        require(msg.sender != address(0x0));

        // Increment image id
        imageCount++;

        // Add Image to contract
        Image storage image = images[imageCount];
        // image = Image(imageCount, _imgHash, _description, 0, msg.sender);
        image.author = msg.sender;
        image.id = imageCount;
        image.hash = _imgHash;
        image.description = _description;
        image.tipAmount = 0;

        allAllimages.push(image);

        //trigger event
        emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
    }

    //tip image
    function tipImageOwner(uint _id) public payable {
        //id is valid
        require(_id > 0 && _id <= imageCount);

        //fetch the image
        Image memory _image = images[_id];

        //fetch author
        address _author = _image.author;

        //pay author
        // address(_author).transfer(msg.value);
        //

        //update tip amount
        _image.tipAmount = _image.tipAmount + msg.value;
        images[_id] = _image;

        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author
        );
    }

    // get Images
    function getImages() public view returns (Image[] memory) {
        return allAllimages;
    }
}
