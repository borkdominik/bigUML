/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Comment;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Property.Label;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlDeployment_Comment {
   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.DEPLOYMENT, DefaultTypes.NODE,
         Comment.class.getSimpleName());
   }

   public enum Property {
      NAME,
      BODY
   }

   public static class DiagramConfiguration implements DiagramElementConfiguration.Node {

      @Override
      public Map<String, EClass> getTypeMappings() { return Map.of(
         Label.typeTypeId(), GraphPackage.Literals.GLABEL); }

      @Override
      public Set<String> getGraphContainableElements() { return Set.of(typeId()); }

      @Override
      public Set<ShapeTypeHint> getShapeTypeHints() {
         return Set.of(
            new ShapeTypeHint(typeId(), true, true, true, false,
               List.of(
                  UmlDeployment_Model.typeId(), // same behavior all levels
                  UmlDeployment_Package.typeId()))); // same behavior on all levels
      }
   }

}
