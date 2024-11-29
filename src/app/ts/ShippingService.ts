class ShippingService {
    userInfo: { address: { districtId: number } };

    constructor(userInfo: { address: { districtId: number } }) {
        this.userInfo = userInfo;
    }

    // Method to set district IDs
    setDistrictIds() {
        const fromDistrictId = 1450; // Declare fromDistrictId
        const toDistrictId = this.userInfo.address.districtId; // Declare toDistrictId

        // You can now use these variables in this method
        console.log(`From District ID: ${fromDistrictId}, To District ID: ${toDistrictId}`);

        // Call another method and pass the district IDs
        this.calculateShippingFee(fromDistrictId, toDistrictId);
    }

    // Method to calculate shipping fee
    calculateShippingFee(fromDistrictId: number, toDistrictId: number) {
        // Use the district IDs here
        console.log(`Calculating shipping fee from ${fromDistrictId} to ${toDistrictId}`);
        // Your logic for calculating shipping fee goes here
    }
}

// Example usage
const userInfo = { address: { districtId: 1454 } }; // Example user info
const shippingService = new ShippingService(userInfo);
shippingService.setDistrictIds(); // This will set the district IDs and calculate the shipping fee