import firebase from 'firebase';
import { IUser } from './User';

export enum Category {
    image = 'image',
    video = 'video'
};

enum Extension {
    JPEG = 'jpeg',
    JPG = 'jpg',
    PNG = 'png',
    GIF = 'gif',
    MP4 = 'mp4'
};

enum Minetype {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  QUICKTIME = 'video/quicktime',
  MP4 = 'video/mp4',
}

export interface IMemory {
    city?: string,
    country?: string,
    countryCode?: string,
    formattedAddress?: string,
    neighnbourhood?: string,
    streetName?: string,
    streetNumber?: string,
    zipcode?: string,
    provider?: string,
    state?: string,
    latitude?: string,
    longtitude?: string,
    id?: string | undefined,
    name: string,
    size: number,
    user: IUser['id'],
    title: string,
    category: keyof typeof Category,
    extension: keyof typeof Extension,
    mimetype: keyof typeof Minetype,
    takenDate: firebase.firestore.Timestamp,
    uploadedDate: firebase.firestore.Timestamp,
    tags?: Array<string>,
    url?: string,
}

export class Memory implements IMemory {
    city?: string | undefined;
    country?: string | undefined;
    countryCode?: string | undefined;
    formattedAddress?: string | undefined;
    neighnbourhood?: string | undefined;
    streetName?: string | undefined;
    streetNumber?: string | undefined;
    zipcode?: string | undefined;
    provider?: string | undefined;
    state?: string | undefined;
    latitude?: string | undefined;
    longtitude?: string | undefined;
    id?: string | undefined;
    name: string;
    title: string = 'One of my best memories with you';
    size: number;
    user: string;
    category: keyof typeof Category;
    extension: keyof typeof Extension;
    mimetype: keyof typeof Minetype;
    takenDate: firebase.firestore.Timestamp = firebase.firestore.Timestamp.now();
    uploadedDate: firebase.firestore.Timestamp = firebase.firestore.Timestamp.now();
    tags: string[] = [];
    url: string = '';

    constructor(
        name: string,
        size: number,
        user: string,
        category: keyof typeof Category,
        extension: keyof typeof Extension,
        mimetype: keyof typeof Minetype,
        title?: string,
        tags?: string[],
        id?: string,
        url?: string,
    ) {
        this.name = name;
        this.size = size;
        this.user = user;
        this.category = category;
        this.extension = extension;
        this.mimetype = mimetype;
        if (title) this.title = title;
        if (tags) this.tags = tags;
        if (id) this.id = id;
        if (url) this.url = url;
    }
}