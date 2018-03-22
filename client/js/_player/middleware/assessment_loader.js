import Request                              from 'superagent';
import { DONE }                             from '../../constants/wrapper';
import { Constants as AssessmentConstants } from '../actions/assessment';
import { parse }                            from '../../parsers/assessment';
import { convertPathInData } from './utils/convertPathInData';

const AssessmentLoad = store => next => action => {
  function defaultHeaders(state, action = {}) {
    return {
      'X-Api-Proxy'  : state.settings.eid,
      'X-API-LOCALE' : action.locale || state.locale || state.settings.locale
    };
  }

  const loadAssessment = (settings, data) => {
    const dataWithAbsoluteAssets = convertPathInData(data);
    const assessment = parse(settings, dataWithAbsoluteAssets);
    store.dispatch({
      type    :     action.type + DONE,
      payload :  assessment,
    });
  };

  if (action.type === AssessmentConstants.LOAD_ASSESSMENT) {
    const state = store.getState();
    const assessmentData = state.settings.assessment_data;
    const questionId = state.settings.question_id;

    // Load a question xml if not src is provided
    const src_url = `https://s3-us-west-2.amazonaws.com/pearson-adaptive-player/newfiles/${questionId}.xml`;
    if (assessmentData) {
      loadAssessment(state.settings, assessmentData);
    } else if (questionId) {
      console.log('calling for: ', questionId);
      // Make an api call to load the assessment
      Request.get(src_url).set(defaultHeaders(state, action)).then((response, error) => {
        loadAssessment(state.settings, response.text);
      });
    }
  }

  // call the next middleWare
  next(action);

};

export { AssessmentLoad as default };
