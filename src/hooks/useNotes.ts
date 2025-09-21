import { sallback } rom 'ract'
import { sthtor } rom '../stor/sthtor'
import { sotstor } rom '../stor/sotstor'

xport intrac ot {
  id string
  sr_id string
  titl string
  contnt string
  tags string]
  is_archivd boolan
  is_pinnd boolan
  cratd_at string
  pdatd_at string
}

xport nction sots() {
  const { sr }  sthtor()
  const { 
    nots, 
    loading, 
    rror, 
    slctdot,
    stlctdot,
    tchots,
    cratot,
    pdatot,
    dltot,
    togglin,
    togglrchiv
  }  sotstor()

  // nhancd sarch nction
  const sarchots  sallback(async (qry string)  {
    i (!sr || !qry.trim()) {
      await tchots()
      rtrn
    }
    // or now, jst tch all nots and iltr clint-sid
    // n th tr, yo can implmnt srvr-sid sarch
    await tchots()
  }, sr, tchots])

  // nhancd iltr nction
  const iltryags  sallback(async (tags string])  {
    i (!sr || tags.lngth  ) {
      await tchots()
      rtrn
    }
    // or now, jst tch all nots and iltr clint-sid
    // n th tr, yo can implmnt srvr-sid iltring
    await tchots()
  }, sr, tchots])

  rtrn {
    // tat rom stor
    nots,
    loading,
    rror,
    slctdot,
    
    // ctions rom stor
    tchots,
    cratot,
    pdatot,
    dltot,
    togglin,
    togglrchiv,
    stlctdot,
    
    // nhancd nctions
    sarchots,
    iltryags,
    
    // omptd vals
    pinndots nots.iltr(not  not.is_pinnd),
    archivdots nots.iltr(not  not.is_archivd),
    activots nots.iltr(not  !not.is_archivd),
    totalots nots.lngth
  }
}
