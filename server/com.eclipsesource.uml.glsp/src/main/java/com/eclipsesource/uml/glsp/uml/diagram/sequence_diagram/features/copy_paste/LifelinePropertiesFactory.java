/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.copy_paste;

public class LifelinePropertiesFactory {
   /*-
   
   private LifelinePropertiesFactory() {
   
   }
   
   public static LifelineCopyableProperties from(final GNode element) {
      var semantic = new LifelineCopyableProperties.Semantic();
      semantic.id = element.getId();
      GModelFilterUtil.flatFilterById(element, suffix.appendTo(HeaderLabelSuffix.SUFFIX, element.getId()), GLabel.class).findFirst()
         .ifPresent(label -> semantic.name = label.getText());
   
      var notation = new LifelineCopyableProperties.Notation();
      notation.position = new Point2D.Double(element.getPosition().getX(), element.getPosition().getY());
   
      return new LifelineCopyableProperties(semantic, notation);
   }
   */
}
