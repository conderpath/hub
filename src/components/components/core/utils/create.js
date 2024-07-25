/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import bem from '../../../widget/core/utils/bem';
import { KEY_COMPONENT_NAME } from '../../../widget/core/utils/variable';
export default function(sfc) {
  sfc.name = KEY_COMPONENT_NAME + (sfc.name || '');
  sfc.mixins = sfc.mixins || [];
  sfc.mixins.push(bem);
  return sfc;
}
