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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.feature.copy_paste.lifeline;

import java.awt.geom.Point2D;

import com.eclipsesource.uml.modelserver.features.copy_paste.BaseCopyableProperties;
import com.eclipsesource.uml.modelserver.features.copy_paste.CopyableNotationProperties;
import com.eclipsesource.uml.modelserver.features.copy_paste.CopyableSemanticProperties;

public class LifelineCopyableProperties
   extends BaseCopyableProperties<LifelineCopyableProperties.Semantic, LifelineCopyableProperties.Notation> {

   public LifelineCopyableProperties(final Semantic semantic, final Notation notation) {
      super(semantic, notation);
   }

   @Override
   public String toString() {
      return "LifelineCopyableProperties [semantic=" + semantic + ", notation=" + notation + "]";
   }

   public static class Semantic implements CopyableSemanticProperties {
      public String id;
      public String name;

      @Override
      public String toString() {
         return "Semantic [id=" + id + ", name=" + name + "]";
      }

   }

   public static class Notation implements CopyableNotationProperties {
      public Point2D.Double position;

      @Override
      public String toString() {
         return "Notation [position=" + position + "]";
      }

   }
}
