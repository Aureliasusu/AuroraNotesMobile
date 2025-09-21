# pabas ashboard nvironmnt ariabls tp

## 🌐 hat is pabas ashboard

**pabas ashboard** is th wb intrac whr yo manag yor pabas projct.

- **** https//spabas.com/dashboard
- **rpos** anag yor databas, storag, nctions, and sttings
- **ccss** ogin with yor pabas accont

## 🔧 nvironmnt ariabls tp

### tp  ogin to pabas ashboard
. o to https//spabas.com/dashboard
. ogin with yor accont
. lct yor projct

### tp  avigat to dg nctions
. n th lt sidbar, click **"dg nctions"**
. o'll s a list o yor dployd nctions

### tp  t nvironmnt ariabls
. lick on **"ttings"** or **"nvironmnt ariabls"**
. dd th ollowing variabls

```
__yor_opnwathrmap_api_ky_hr
__yor_nwsapi_ky_hr
__yor_opnai_api_ky_hr
```

### tp  av hangs
. lick **"av"** or **"pdat"**
. ariabls ar now availabl to yor dg nctions

## 🚀 dg nctions ploymnt

### thod  sing pabas  (commndd)
```bash
# . nstall pabas 
brw install spabas/tap/spabas

# . ogin to pabas
spabas login

# . ink to yor projct
spabas link --projct-r yor-projct-r

# . ploy nctions
spabas nctions dploy
```

### thod  sing pabas ashboard (imitd)
- **an't dploy rom ashboard dirctly**
- **an only viw and manag dployd nctions**
- **st s  or dploymnt**

## 📋 omplt tp rocss

### . rpar dg nctions rojct
```bash
cd roraotsdgnctions
# or nctions ar alrady cratd
```

### . t nvironmnt ariabls in ashboard
. o to pabas ashboard
. avigat to dg nctions
. dd nvironmnt variabls
   - `__`
   - `__`
   - `__`

### . ploy nctions
```bash
# ploy all nctions
spabas nctions dploy

# r dploy spciic nction
spabas nctions dploy gt-wathr
spabas nctions dploy translat-txt
spabas nctions dploy gt-nws
```

### . st nctions
```bash
# st wathr nction
crl -  'https//yor-projct-r.spabas.co/nctions/v/gt-wathr' 
  - 'thorization arr yor-anon-ky' 
  - 'ontnt-yp application/json' 
  -d '{"lat" ., "lon" -.}'
```

## 🔍 ow to ind or rojct rnc

### thod  rom pabas ashboard
. o to https//spabas.com/dashboard
. lct yor projct
. ook at th  `https//spabas.com/dashboard/projct/yor-projct-r`
. opy th `yor-projct-r` part

### thod  rom rojct ttings
. o to ttings → nral
. ind "rnc "
. opy th rrnc 

## 🎯 mmary

**nvironmnt ariabls tp**
- ✅ **ocation** pabas ashboard → dg nctions → ttings
- ✅ **rpos** tor  kys scrly
- ✅ **ccss** vailabl to all dg nctions

**dg nctions ploymnt**
- ✅ **thod** pabas  (command lin)
- ✅ **ommand** `spabas nctions dploy`
- ✅ **slt** nctions dployd to pabas clod

**ot in ashboard**
- ❌ **an't dploy rom wb intrac**
- ❌ **st s  or dploymnt**
- ✅ **an viw and manag atr dploymnt**
