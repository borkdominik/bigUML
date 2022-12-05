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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public final class DeploymentTypes {

   // DEPLOYMENT DIAGRAM
   public static final String ICON_DEPLOYMENT_NODE = CoreTypes.PRE_ICON + "node";
   public static final String DEPLOYMENT_NODE = CoreTypes.PRE_NODE + "node";
   public static final String LABEL_NODE_NAME = CoreTypes.PRE_LABEL + "node:name";
   public static final String ICON_ARTIFACT = CoreTypes.PRE_ICON + "artifact";
   public static final String ARTIFACT = CoreTypes.PRE_NODE + "artifact";
   public static final String COMMUNICATION_PATH = CoreTypes.PRE_EDGE + "communicationpath";
   public static final String DEPLOYMENT = CoreTypes.PRE_EDGE + "deployment";
   public static final String ICON_EXECUTION_ENVIRONMENT = CoreTypes.PRE_ICON + "executionenvironment";
   public static final String EXECUTION_ENVIRONMENT = CoreTypes.PRE_NODE + "executionenvironment";
   public static final String ICON_DEVICE = CoreTypes.PRE_ICON + "device";
   public static final String DEVICE = CoreTypes.PRE_NODE + "device";
   public static final String ICON_DEPLOYMENT_SPECIFICATION = CoreTypes.PRE_ICON + "deploymentspecification";
   public static final String DEPLOYMENT_SPECIFICATION = CoreTypes.PRE_NODE + "deploymentspecification";
   public static final String DEPLOYMENT_COMPONENT = CoreTypes.PRE_NODE + "deploymentcomponent";

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   // SHARED WITH CLASS AND USECASE
   public static final String LABEL_EDGE_MULTIPLICITY = CoreTypes.PRE_LABEL + "edge-multiplicity";

   private DeploymentTypes() {}
}
