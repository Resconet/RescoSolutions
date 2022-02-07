<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="xml" version="1.0" encoding="utf-8" indent="yes" />
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
    </xsl:copy>
  </xsl:template>
  <xsl:template match="cfg:mobileprojecttemplates" xmlns:cfg="http://schema.resco.net/mobilecrm/woodford/configuration">
    <xsl:element name="{local-name()}" namespace="http://schema.resco.net/mobilecrm/woodford/configuration">
      <xsl:copy-of select="*" />
      <xsl:copy-of select="document('./config.xml')/cfg:configuration/cfg:woodford/cfg:mobileprojecttemplates/cfg:mobileprojecttemplate" />
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>
