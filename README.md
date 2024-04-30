# sg-sdx

# Upload
sgmf-scripts --uploadCartridge=sdx_tag

# Install JS-TAG (DEV script)

Insert the following script on top of the original template `default/components/header/htmlhead.isml`

<script>
  // SDX tag init
  var shopName = "zyow-001.dx.commercecloud.salesforce.com";
  !function(){window.__sdx_project_id=shopName,window.__sdx_config_url="https://config.ur2inc.com/shop/"+shopName+".conf";var e=document.createElement("script");e.src="https://tag.ur2inc.com/sdx-dev.js",e.async=!0,e.onload=function(){window.sdxCapture.load(window.SdxConfig)},document.head.appendChild(e);}();
</script>