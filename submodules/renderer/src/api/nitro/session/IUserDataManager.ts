import { IConnection } from '../../communication';
import { IRoomUserData } from './IRoomUserData';

export interface IUserDataManager
{
    setConnection(connection: IConnection): void;
    getUserData(webID: number): IRoomUserData;
    getPetData(webID: number): IRoomUserData;
    getBotData(webID: number): IRoomUserData;
    getRentableBotData(webID: number): IRoomUserData;
    getDataByType(webID: number, type: number): IRoomUserData;
    getUserDataByIndex(roomIndex: number): IRoomUserData;
    getUserDataByName(name: string): IRoomUserData;
    updateUserData(data: IRoomUserData): void;
    removeUserData(roomIndex: number): void;
    getUserBadges(userId: number): string[];
    setUserBadges(userId: number, badges: string[]): void;
    updateFigure(roomIndex: number, figure: string, sex: string, hasSaddle: boolean, isRiding: boolean): void;
    updateName(roomIndex: number, name: string): void;
    updateMotto(roomIndex: number, custom: string): void;
	updateBackground(roomIndex: number, background: number, stand: number, overlay: number): void;																							  
    updateAchievementScore(roomIndex: number, score: number): void;
    updatePetLevel(roomIndex: number, level: number): void;
    updatePetBreedingStatus(roomIndex: number, canBreed: boolean, canHarvest: boolean, canRevive: boolean, hasBreedingPermission: boolean): void;
    requestPetInfo(id: number): void;
    connection: IConnection;
}
