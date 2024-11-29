export class Skintype {
    skinID: number;       
    skinName: string;    

    constructor(
        skinID: number = 0,
        skinName: string = '',
    ) {
        this.skinID = skinID;
        this.skinName = skinName;
    }
}
