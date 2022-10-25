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
package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.util;

import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.PackageableElement;

public class DeplyomentSemanticCommandUtil {
   public static String getNewNodeName(final Model umlModel) {
      return getNewPackageableElementName(Node.class, umlModel);
   }

   public static String getNewArtifactName(final Model umlModel) {
      return getNewPackageableElementName(Artifact.class, umlModel);
   }

   public static String getNewExecutionEnvironmentName(final Model umlModel) {
      return getNewPackageableElementName(ExecutionEnvironment.class, umlModel);
   }

   public static String getNewDeviceName(final Model umlModel) {
      return getNewPackageableElementName(Device.class, umlModel);
   }

   public static String getNewDeploymentSpecificationName(final Model umlModel) {
      return getNewPackageableElementName(DeploymentSpecification.class, umlModel);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

}
