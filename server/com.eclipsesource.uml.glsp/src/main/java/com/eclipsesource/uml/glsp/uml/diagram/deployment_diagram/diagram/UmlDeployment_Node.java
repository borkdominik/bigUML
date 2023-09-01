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
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlDeployment_Node {
   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.DEPLOYMENT, DefaultTypes.NODE,
         Node.class.getSimpleName());
   }

   public enum Property {
      NAME,
      IS_ABSTRACT,
      IS_ACTIVE,
      VISIBILITY_KIND
   }

   public static class DiagramConfiguration implements DiagramElementConfiguration.Node {

      @Override
      public Map<String, EClass> getTypeMappings() { return Map.of(
         typeId(), GraphPackage.Literals.GNODE); }

      @Override
      public Set<String> getGraphContainableElements() { return Set.of(typeId()); }

      @Override
      public Set<ShapeTypeHint> getShapeTypeHints() {
         return Set.of(
            new ShapeTypeHint(typeId(), true, true, true, false,
               List.of(
                  UmlDeployment_Artifact.typeId(), // same behavior as artifact
                  UmlDeployment_Device.typeId(), // only on lvl 1 no children allowed !- not supported within node
                  UmlDeployment_DeploymentSpecification.typeId(), // same behavior as DS !-- not supoprted within node
                  UmlDeployment_ExecutionEnvironment.typeId(), // only on lvl 1 no children allowed
                  UmlDeployment_Node.typeId() // only on lvl 1 no children allowed
               )));
      }
   }
}
