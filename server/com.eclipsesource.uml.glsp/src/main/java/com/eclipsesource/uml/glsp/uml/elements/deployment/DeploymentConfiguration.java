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
package com.eclipsesource.uml.glsp.uml.elements.deployment;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationEdgeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DeploymentConfiguration extends RepresentationEdgeConfiguration<Deployment> {
   @Inject
   public DeploymentConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      NAME
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(typeId(), GraphPackage.Literals.GEDGE); }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      return Set.of(
         new EdgeTypeHint(typeId(), true, true, true,
            List.of(
               configurationFor(Artifact.class).typeId(),
               configurationFor(DeploymentSpecification.class).typeId()),

            List.of(
               configurationFor(Device.class).typeId(),
               configurationFor(ExecutionEnvironment.class).typeId(),
               configurationFor(org.eclipse.uml2.uml.Node.class).typeId())));
   }

}
