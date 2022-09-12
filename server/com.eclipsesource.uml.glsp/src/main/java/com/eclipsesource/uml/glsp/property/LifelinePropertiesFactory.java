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
package com.eclipsesource.uml.glsp.property;

import java.awt.geom.Point2D;

import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;

import com.eclipsesource.uml.glsp.util.UmlGModelUtil;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.LifelineCopyableProperties;

public class LifelinePropertiesFactory {

   private LifelinePropertiesFactory() {

   }

   public static LifelineCopyableProperties from(final GNode element) {
      var semantic = new LifelineCopyableProperties.Semantic();
      semantic.id = element.getId();
      UmlGModelUtil.flatFilterById(element, UmlIDUtil.createHeaderLabelId(element.getId()), GLabel.class).findFirst()
         .ifPresent(label -> semantic.name = label.getText());

      var notation = new LifelineCopyableProperties.Notation();
      notation.position = new Point2D.Double(element.getPosition().getX(), element.getPosition().getY());

      return new LifelineCopyableProperties(semantic, notation);
   }

}
