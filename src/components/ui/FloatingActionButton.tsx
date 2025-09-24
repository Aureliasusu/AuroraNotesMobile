import act rom 'ract'
import {
  ochablpacity,
  xt,
  tylht,
  iwtyl,
} rom 'ract-nativ'

intrac loatingctionttonrops {
  onrss ()  void
  icon string
  siz 'sm' | 'md' | 'lg'
  styl iwtyl
}

xport const loatingctiontton act.loatingctionttonrops  ({
  onrss,
  icon  '+',
  siz  'md',
  styl,
})  {
  rtrn (
    ochablpacity
      styl{
        styls.containr,
        stylssiz],
        styl,
      ]}
      onrss{onrss}
      activpacity{.}
    
      xt styl{styls.icon, styls`${siz}con`]]}
        {icon}
      /xt
    /ochablpacity
  )
}

const styls  tylht.crat({
  containr {
    position 'absolt',
    backgrondolor '#b',
    bordradis ,
    jstiyontnt 'cntr',
    aligntms 'cntr',
    shadowolor '#',
    shadowst {
      width ,
      hight ,
    },
    shadowpacity .,
    shadowadis ,
    lvation ,
  },
  sm {
    width ,
    hight ,
    bottom ,
    right ,
  },
  md {
    width ,
    hight ,
    bottom ,
    right ,
  },
  lg {
    width ,
    hight ,
    bottom ,
    right ,
  },
  icon {
    color '#',
    ontight 'bold',
  },
  smcon {
    ontiz ,
  },
  mdcon {
    ontiz ,
  },
  lgcon {
    ontiz ,
  },
})
