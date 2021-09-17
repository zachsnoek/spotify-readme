import { AzureFunction, Context } from '@azure/functions';
import * as ejs from 'ejs';
import * as spotify from '../services/spotify';

const getCurrentTrack: AzureFunction = async function (
    context: Context
): Promise<void> {
    try {
        const track = await spotify.getCurrentlyPlayingTrack();
        const svg = await ejs.renderFile('templates/current-track.ejs', {
            track,
        });

        context.res = {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'max-age=90',
            },
            body: svg,
        };
    } catch (error) {
        console.error(error);
        context.res = {
            status: 500,
        };
    }
};

export default getCurrentTrack;
