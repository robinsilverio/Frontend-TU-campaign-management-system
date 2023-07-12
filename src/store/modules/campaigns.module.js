import CampaignService from "@/services/campaign-service";
import store from "@/store";
import {CampaignMapping} from "@/models/mapping/CampaignMapping";

const campaignService = new CampaignService();
export const campaigns = {
    state: {
        campaigns: []
    },
    getters: {
        getCampaigns(state) {
            return state.campaigns;
        }
    },
    actions: {
        retrieveCampaigns({commit}) {
            const BASE_URL = store.getters.getBaseUrl;
            return campaignService.retrieveCampaigns(BASE_URL)
                .then(
                    success => {
                        commit('setCampaigns', success.data.campaigns);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                );
        }
    },
    mutations: {
        setCampaigns(state, paramCampaigns) {

            let campaignMappings = [];

            for (let campaign of paramCampaigns) {
                campaignMappings.push(new CampaignMapping(campaign));
            }

            state.campaigns = campaignMappings;
        }
    }
}