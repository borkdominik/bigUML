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
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.Manifestation;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlDeployment_Manifestation {
   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.DEPLOYMENT, DefaultTypes.EDGE,
         Manifestation.class.getSimpleName());
   }

   public enum Property {
      NAME
   }

   public static class DiagramConfiguration implements DiagramElementConfiguration.Edge {

      @Override
      public Map<String, EClass> getTypeMappings() { return Map.of(typeId(), GraphPackage.Literals.GEDGE); }

      @Override
      public Set<EdgeTypeHint> getEdgeTypeHints() {
         return Set.of(
            new EdgeTypeHint(typeId(), true, true, true,
               List.of(
                  UmlDeployment_Artifact.typeId()),
               List.of(
                  UmlDeployment_Artifact.typeId(),
                  UmlDeployment_Device.typeId(),
                  UmlDeployment_DeploymentSpecification.typeId(),
                  UmlDeployment_ExecutionEnvironment.typeId(),
                  UmlDeployment_Model.typeId(),
                  UmlDeployment_Node.typeId(),
                  UmlDeployment_Package.typeId())));
      }
   }
}
