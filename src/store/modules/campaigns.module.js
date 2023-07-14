import CampaignService from "@/services/campaign-service";
import store from "@/store";
import {CampaignMapping} from "@/models/mapping/CampaignMapping";

const campaignService = new CampaignService();
export const campaigns = {
    state: {
        campaigns: [],
        selectedCampaign: null
    },
    getters: {
        getCampaigns(state) {
            return state.campaigns;
        },
        getSelectedCampaign(state) {
            return state.selectedCampaign;
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
        },
        createCampaign({commit}) {

        },
        updateCampaign({commit}, paramCampaign) {

        },
        deleteCampaign({commit}, paramCampaign) {

        }
    },
    mutations: {
        updateSelectedCampaign(state, campaign){
            state.selectedCampaign = campaign;
        },
        setCampaigns(state, paramCampaigns) {

            let campaignMappings = [];

            for (let campaign of paramCampaigns) {
                campaignMappings.push(new CampaignMapping(campaign));
            }

            state.campaigns = campaignMappings;
        }
    }
}